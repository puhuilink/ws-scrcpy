import { ToolBoxElement } from './ToolBoxElement';

export class ToolBox {
    private readonly holder: HTMLElement;

    constructor(list: any[]) {
        this.holder = document.createElement('div');
        this.holder.classList.add('control-buttons-list', 'control-wrapper');
        list.forEach((item) => {
            if (item instanceof ToolBoxElement) {
                item.getAllElements().forEach((el) => {
                    this.holder.appendChild(el);
                });
            } else {
                this.holder.appendChild(item);
            }
        });
    }

    public getHolderElement(): HTMLElement {
        return this.holder;
    }
}
