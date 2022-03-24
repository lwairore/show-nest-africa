import { Component, Input, OnInit } from '@angular/core';
import { liveQuery } from 'dexie';
import { defer, from } from 'rxjs';
import { db, TodoItem, TodoList } from '../../db/db';

@Component({
  selector: 'snap-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {
  @Input() todoList!: TodoList;
  // Observe an arbritary query:
  todoItems$ = liveQuery(() =>
    this.listTodoItems());

  todoItems: TodoItem[] = [];

  async listTodoItems() {
    return await db.todoItems
      .where({
        todoListId: this.todoList.id,
      })
      .toArray().then(details =>
        this.todoItems = [...details]);
  }

  async addItem() {
    await db.todoItems.add({
      title: this.itemName,
      todoListId: this.todoList.id as number,
    });
  }

  itemName = 'My new item';
}
