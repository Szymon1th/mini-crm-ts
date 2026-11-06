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
        const item = this.items.find(item => item.id === id);
        if (!item) return undefined;
        return { ...item };
    }
    
    exists(id: number): boolean{
        return this.getById(id) !== undefined
    }

    getAll(): T[]{
        return this.items.map(item=> ({...item}))
    }

    update(id:number,changes:Partial<Omit<T,"id">>):T|undefined{
        const index = this.items.findIndex(item=>item.id===id)
        if(index==-1)return undefined

        const existing = this.items[index]


        const updatedItem :T= {
            ...existing,
            ...changes
        } as T

        this.items[index] = updatedItem

        return {...this.items[index]}
        
    }
}