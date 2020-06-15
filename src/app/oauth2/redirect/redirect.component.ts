import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  token: string;
  constructor(private route: ActivatedRoute,
              private router: Router) {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('token')) {
        this.router.navigate(['/home']);
      } else {
        console.log(params);
      }
    });
  }

  ngOnInit() {
  }

}
