class Repository<T extends {id:number}>{
    private items : T[] = []

    addItem(item:T):void{
        const isItemExist = this.items.some(el=>(el.id === item.id ))
        if(isItemExist){
            throw new Error("Cant add item, id is already taken")
        }
        this.items.push({...item})
    }

    getById(id: number): T | undefined {
        return this.items.find(el => el.id === id);
    }
    
    exists(id: number): boolean{
        return this.getById(id) !== undefined
    }

    getAll(): T[]{
        return this.items.map(item=> ({...item}))
    }
}