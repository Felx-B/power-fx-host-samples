import { ChangeDetectorRef, Component } from '@angular/core';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngclient';
  result = "";

  constructor(private http: HttpService, private cdr: ChangeDetectorRef){  }

  valueChanged(expression: any){
    console.log("triggered", expression);
   this._evalAsync("{}", expression);
  }

  private async _evalAsync (context: string, expression: string): Promise<void> {
    const result = await this.http.sendDataAsync('eval', JSON.stringify({ context, expression }));
    if (!result.ok) {
      return;
    }

    const response = await result.json();

    this.result = response.result || response.error || "";
    this.cdr.detectChanges();
  };
}
