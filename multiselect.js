import Validation from "./Validation.js";
export default class Multiselect extends HTMLElement{
    props ={
        options: {
            type: Array,
            value: []
        },
        input: {
            type: String,
            value: 'Default'
        },
        persistent: {
            type:  Boolean,
            value: false
        },
        callback: {
            type: Function,
            value: null
        }
    }
    selectValue = [];
    flagSelectAll = false;

    constructor(){
        super();
        this.valid = new Validation();
    }
    static get observedAttributes(){
        return ['options', 'persistent', 'callback', 'input']
    }
    attributeChangedCallback(attrib, oldValue, newValue){
        this.props[attrib].value = this.valid.validate(this.props[attrib], newValue, attrib);
    }
    connectedCallback(){
        this.render();
    }
    getStyle(){
        let text = `
            .multiselect{
                position: relative;
                margin-right: 10px;
            }
            .option-container{
                position: absolute;
                visibility: hidden;
                width: 100%;
                height: auto;
                max-height: 7rem;
                background-color: white;
                box-shadow: 2px 2px 5px rgb(118, 118, 118);
                z-index: 1;
                margin-top: 1px;
                overflow-x: auto;
            }
            .option-container::-webkit-scrollbar {
                width: 8px;
            }
            .option-container::-webkit-scrollbar-thumb {
                background: #ccc;
                border-radius: 4px;
                width: 2px;
            }
            /* Cambiamos el fondo y agregamos una sombra cuando esté en hover */
            .option-container::-webkit-scrollbar-thumb:hover {
                background: #b3b3b3;
                box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
            }
            /* Cambiamos el fondo cuando esté en active */
            .option-container::-webkit-scrollbar-thumb:active {
                background-color: #413c3c;
            }
            .option-container > option:hover{
                cursor: pointer;
                background-color: rgb(194, 194, 194);
            }
            .option-container > div:hover{
                cursor: pointer;
                background-color: rgb(194, 194, 194);
            }
            .input-container{
                width: 100%;
            }
            .open-container{
                visibility: visible !important;
                /* height: 100px; */
            }
            .selected{
                background-color: rgb(94, 168, 225);
            }
        `
        let style = document.createElement('style');
        style.textContent = text;
        return style;
    }

    render(){
        this.classList.add('multiselect')
        let container = document.createElement('div');
        container.classList.add('option-container');
        container.onclick = (evt)=>{
            this.openContainer(container) 
        }
        
        let input = document.createElement('input');
        input.classList.add('input-container');
        input.readOnly = true;
        input.id = `Input${this.props.input.value.replace(" ", '')}`;
        input.onclick = (evt)=>{
            evt.target.blur();
            evt.stopPropagation(); 
            let close = this.closeContainer;
            document.addEventListener('click',function(evt) {
                if(evt.target.tagName == "OPTION"){return false;}
                close(container);
            });
            this.openContainer(container) 
        }
        this.append(input);
        
        let buttom = document.createElement('div');
        buttom.innerHTML = "Todos";
        buttom.onclick = () =>{ 
            if(this.flagSelectAll){
                this.RemoveAll(container, input)
            }else{
                this.SelectAll(container, input)
            }
        };
        container.appendChild(buttom);

        this.props.options.value.forEach((item, i) => {
            let option = document.createElement('option');
            option.value = item.value;
            option.innerHTML = item.value;
            option.onclick = ()=>{ this.selectItem(option, input); this.callback && this.callback(option) ;}
            if(item.hasOwnProperty('precio')){
                option.dataset.precio  = item.precio;
            }
            container.appendChild(option);
        });

        this.append(container);
    }

    openContainer(container){
        if(!this.props.persistent.value){
            container.classList.toggle('open-container');
            return;
        }
        if(!container.classList.contains('open-container')){
            container.classList.add('open-container');
        }
    }
    closeContainer(container){
        container.classList.remove('open-container');
    }
    SelectAll(container, input){
        for(let i = 0; i < container.children.length; i++){
            if(container.children[i].tagName == 'DIV'){
                continue
            };
            if(!container.children[i].selected){
                container.children[i].selected = true;
                this.selectValue.push(container.children[i].value);
                if(!container.children[i].classList.contains('selected')){
                    container.children[i].classList.add('selected')
                }
            }
        }
        input.value = this.selectValue.toString();
        this.flagSelectAll = true;
    }
    RemoveAll(container, input){
        for(let i = 0; i < container.children.length; i++){
            if(container.children[i].tagName == 'DIV'){
                continue
            };
            container.children[i].selected = false;
            if(container.children[i].classList.contains('selected')){
                container.children[i].classList.remove('selected')
            }
        }
        input.value = null;
        this.selectValue = [];
        this.flagSelectAll = false;
    }
    selectItem(option, input){
        if(option.selected){
            option.selected = false;
            option.classList.remove('selected');

            // falta el metodo para quitar los seleccionados
            let index = this.selectValue.indexOf(option.value);
            this.selectValue.splice(index, 1);
        }else{
            option.selected = true;
            this.selectValue.push(option.value);
            option.classList.add('selected')
        }
        input.value = this.selectValue.toString()
    }
}
