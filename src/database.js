import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => this.#database = JSON.parse(data))
      .catch(() => this.#persist())
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search){
    let data = this.#database[table] ?? []

    if(search) {
      data = data.filter(row => Object.entries(search).some(([key, value]) => row[key].toLowerCase().includes(decodeURIComponent(value.toLowerCase()))))
    }
    
    return data
  }

  insert(table, data){
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  update(table, id, data){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex === -1){
      return null;
    }

    this.#database[table][rowIndex] = {
      id,
      title: data.title,
      completed_at: this.#database[table][rowIndex].completed_at,
      description: data.description,
      created_at: this.#database[table][rowIndex].created_at,
      updated_at: data.updated_at

    }

    this.#persist()

    return this.#database[table][rowIndex]
  }

  patch(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex === -1){
      return null;
    }

    this.#database[table][rowIndex] = {
      id,
      title: this.#database[table][rowIndex].title,
      completed_at: this.#database[table][rowIndex].completed_at ? null : data.completed_at,
      description: this.#database[table][rowIndex].description,
      created_at: this.#database[table][rowIndex].created_at,
      updated_at: this.#database[table][rowIndex].updated_at

    }
    
    this.#persist()

    return this.#database[table][rowIndex]
  }

  delete(table, id){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex === -1){
      return null;
    }

    const data = this.#database[table][rowIndex]
    this.#database[table].splice(rowIndex, 1)
    this.#persist()

    return data
  }
}