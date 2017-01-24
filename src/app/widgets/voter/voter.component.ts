import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'ui-voter',
    templateUrl: './voter.component.html',
    styleUrls: ['./voter.component.css']
})
export class VoterComponent {

    @Input() voteCount: number;
    @Input() myVote: number;

    UpVote() {
        if (this.myVote === 1) { return; };
        this.myVote++;
    }

    DownVote() {
        if (this.myVote === -1) { return; };
        this.myVote--;
    }
}
