import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})

export class AppComponent implements OnInit {
    message: string;

    ngOnInit() {
        this.message = 'Hello, World!!!';
    }
}
