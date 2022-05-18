import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {faSearch, faTrash, faUndo} from '@fortawesome/free-solid-svg-icons';
import {CompleteConversionApiService} from '../../services/complete-conversion-api/complete-conversion-api.service';
import {CompleteConversion} from '../../shared/models/complete-conversion.model';
import {CompleteConversionJob} from '../../shared/models/complete-conversion-job.model';

@Component({
  selector: 'app-complete-conversion-overview',
  templateUrl: './complete-conversion-overview.component.html',
  styleUrls: ['./complete-conversion-overview.component.scss']
})
export class CompleteConversionOverviewComponent implements OnInit {

  faSearch = faSearch;
  faTrash = faTrash;
  faUndo = faUndo;

  completeConversions: CompleteConversion[];
  selectedCompleteConversion: CompleteConversion;
  completeConversionJobs: CompleteConversionJob[];
  failedJob: CompleteConversionJob;

  constructor(private completeConversionApiService: CompleteConversionApiService) {
  }

  ngOnInit(): void {
    this.reloadCompleteConversions();
  }

  reloadCompleteConversions() {
    this.completeConversionApiService.load().subscribe(completeConversions => {
      this.completeConversions = _.orderBy(completeConversions, 'id', 'desc');
    });
  }

  deleteCompleteConversion(id: number) {
    this.resetData();
    this.completeConversionApiService.delete(id).subscribe(() => this.reloadCompleteConversions());
  }

  getJobCount(completeConversion: CompleteConversion) {
    let counts = _.countBy(completeConversion.jobs, (job) => {
      return job.status === 'finished' ? 'finished' : 'notFinished'
    });

    let finished = counts['finished'] ? counts['finished'] : 0;

    return finished + '/' + completeConversion.jobs.length;
  }

  retry(id: number) {
    this.resetData();
    this.completeConversionApiService.restart(id).subscribe(() => this.reloadCompleteConversions());
  }

  refresh() {
    this.resetData();
    this.reloadCompleteConversions();
  }

  resetData() {
    this.failedJob = null;
    this.selectedCompleteConversion = null;
    this.completeConversions = [];
    this.completeConversionJobs = [];
  }
}
