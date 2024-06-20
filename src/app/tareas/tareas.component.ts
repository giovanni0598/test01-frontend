// src/app/tareas/tareas.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, timer, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AppState } from '../store/app.state';

interface Task {
  name: string;
  completed: boolean;
  time?: number;
  requesting?: boolean;
  stoppedAt?: number; // Añadir campo de tiempo detenido
}

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {
  newTask: string = '';
  tasks: Task[] = [];
  selectedTask: Task | null = null;
  username$: Observable<string | null>;
  role$: Observable<string | null>;
  requestTimer: Subscription | null = null;
  private stopTimer$ = new Subject<void>();
  requestStartTime: number = 0;

  constructor(private store: Store<AppState>) {
    this.username$ = this.store.select(state => state.auth.username);
    this.role$ = this.store.select(state => state.auth.role);
  }

  ngOnInit(): void { }

  addTask() {
    if (this.newTask.trim()) {
      this.tasks.push({ name: this.newTask.trim(), completed: false });
      this.newTask = '';
    }
  }

  removeTask(task: Task) {
    this.tasks = this.tasks.filter(t => t !== task);
  }

  toggleTask(task: Task) {
    task.completed = task.completed;
  }

  editTask(task: Task) {
    this.selectedTask = { ...task };
  }

  saveTask() {
    if (this.selectedTask) {
      const index = this.tasks.findIndex(t => t.name === this.selectedTask!.name);
      this.tasks[index] = this.selectedTask;
      this.selectedTask = null;
    }
  }

  cancelEdit() {
    this.selectedTask = null;
  }

  initiateTask(task: Task) {
    task.requesting = true;
    timer(20000).pipe(takeUntil(this.stopTimer$)).subscribe(() => {
      this.stopTimer$.next();
      this.cancelRequest(task,false, true)
      this.stopTimer$ = new Subject<void>();
    });
    this.requestTimer = timer((task.time! * 1000)).pipe(takeUntil(this.stopTimer$)).subscribe((x) => {
      if (task.requesting) {
        task.requesting = false;
      }
      alert(`La ejecucion: ${task.name} ha culminado su ejecucion de ${task.time} segundos`);
      this.stopTimer$.next();
      this.stopTimer$ = new Subject<void>();
    });

  }
  

  cancelRequest(task: Task, abort?:boolean, notify?:boolean) {
    if(notify){
      task.requesting = false;
      task.stoppedAt = Date.now();
      if(abort){
        alert(`La ejecucion: ${task.name} se ha detenido en los ${((task.stoppedAt - (this.requestStartTime || 0)) / 1000).toFixed(0)} segundos de su ejecucion, en ves de los ${task.time} segundos`);
        this.stopTimer$.next();
      }
      if(!abort) alert(`La ejecucion: ${task.name} se ha detenido porque llego a su limite de ejecucion`);
  
      if (this.requestTimer) {
        this.requestTimer.unsubscribe();
      }
    }
  }

  handleTaskStart(task: Task) {
    if (task.requesting) {
      this.cancelRequest(task, true, true);
    } else {
      this.requestStartTime = Date.now();
      this.initiateTask(task);

    }
  }
}
