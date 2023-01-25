import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import CountryList from './Country';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(private Http: HttpClient) { }
  @ViewChild('SelectFrom') SelectFrom: any;
  @ViewChild('SelectTo') SelectTo: any;
  @ViewChild('InputAmount') InputAmount: any;
  @ViewChild('ExchangeOutput') ExchangeOutput: any;

  ngOnInit(): void {
    const DropdownList = document.querySelectorAll(".Select__Box .Select");
    for (let index = 0; index < 2; index++) {
      for (let Code in CountryList!) {
        let selected = Number(index) == 0 ? Code == "USD" ? "selected" : "" : Code == "GEL" ? "selected" : "";
        let optionTag = `<option value="${Code}" ${selected}> ${Code} </option>`;
        DropdownList[index].insertAdjacentHTML('beforeend', optionTag);
      }
    }
    this.Exchange();
  }

  Replace() {
    document.querySelector('.Button-Exchange')?.classList.toggle('rotate');
    let TempCode = this.SelectFrom?.nativeElement.value;
    this.SelectFrom.nativeElement.value = this.SelectTo?.nativeElement.value;
    this.SelectTo.nativeElement.value = TempCode;
    this.LoadFlag(this.SelectFrom)
    this.LoadFlag(this.SelectTo);
    this.Exchange();
  }

  LoadFlag(element: any) {
    let value = element.target?.value || element.nativeElement?.value;
    for (let Code in CountryList) {
      if (Code == value) {
        let FlagImage = Code.slice(0, 2);
        let ImgTag = element.target?.parentElement.querySelector('img') || element.nativeElement?.parentElement.querySelector('img');
        ImgTag.src = `https://flagsapi.com/${FlagImage}/shiny/32.png`;
        if (FlagImage == 'EU') {
          ImgTag.src = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCAAqAEADASIAAhEBAxEB/8QAGgABAQADAQEAAAAAAAAAAAAAAAQCAwUBB//EACcQAAIABQQBAwUAAAAAAAAAAAECAAMEETEFEiFBExVxgSJhYpGx/8QAGQEBAQADAQAAAAAAAAAAAAAAAAMCBAUG/8QAIxEAAQMEAQUBAQAAAAAAAAAAAQACEQMSITFBBBMiUXGRYf/aAAwDAQACEQMRAD8A+bwhCPYLiJjMUU1FPqK+XRIgWodwgVyF+o9cxUKB6bTKfVpdXJ3GdtElWYTFIweB9m5v1wb406jqlZqVca2qnFqggDevGBbgDHxGv3X1CRSiMiTOHDWORuc/FWwNHnvH4tdTRT6evmUToGqJbmWVQhvqHXET5xFmnapWabXCtpZxWoAI3tze4tyDn5jcaB6nTKjVplXJ3CdtMlmYzGJyeR915v3yb5d19MgVYjAkTlx/nA1GfqWBw8N5/FzYQhGwpJD3hCCK/V6WipJslaCtNUrygztsC7GwRk9g/scnMQRfN9L9HlePz+peQ+S7DZsPx1bH5ZOBC6sjFHUqw4IIsREOnJstcSSJEmJMc4xCpVAukRn0vIv0ikoqubOWvrTSqkosjbA29sAZHZH6PIzEKKzsERSzHgAC5MXSvS/R5vk8/qXkHjsw2bB8d3x+ORguoJstaSCYEiJE85xCUgLpMY9qD2hCEXU0hCEEWcmY0mak1DZkYMDcjke0dCdq7V+tS9Q1aUtQAV8kpbgMo6Avx/L9HB5kIk+ix5uIzBE8wdwVm2o5oga2unJ1dqDWpmoaTKWnBZvHKa5CqeiL8/y/Nhgc+dMadNea5uzsWJJJ5PvGEIMosYbgMwBPMDUnlHVHOEHW0hCEVWC//9k=`;
        }
      }
    }
    this.Exchange();
  }

  Exchange() {
    this.Http.get(`https://v6.exchangerate-api.com/v6/562df202aa02ec3790b30946/latest/${this.SelectFrom?.nativeElement.value !== undefined ? this.SelectFrom?.nativeElement.value : "USD"}`).subscribe((data: any) => {
      let ExchangeRate = data.conversion_rates[this.SelectTo.nativeElement.value];
      let TotalExchangeRate = (this.InputAmount.nativeElement.value * ExchangeRate).toFixed(2);
      this.ExchangeOutput.nativeElement.value = TotalExchangeRate + ` ${this.SelectTo.nativeElement.value}`;
    },
      error => {
        console.error(error);
      });
  }
}
