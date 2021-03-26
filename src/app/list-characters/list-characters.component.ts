import { PaginateResponse } from './../PaginateResponse';
import { CharacterService } from './../character.service';
import { Character } from './../character';
import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-characters',
  templateUrl: './list-characters.component.html',
  styleUrls: ['./list-characters.component.css']
})
export class ListCharactersComponent implements OnInit {

  characters: Character[];
  currentPage: Number;
  count: Number;
  isLoading: Boolean;
  err: any;


  constructor(
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.currentPage = +this.route.snapshot.paramMap.get('currentPage');
    this.count = 0;
    this.getCharacters(this.currentPage);
  }

  onPageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.getCharacters(this.currentPage);
    this.router.navigate(['/characters/' + event.page]);
  }

  getCharacters(page: Number): void {
    this.isLoading = true;
    this.err = null;

    this.characterService.getCharacters(page)
    .subscribe((response:PaginateResponse) => {
      console.log(response);
      this.count = response.meta.count;
      this.characters = response.results;
    },
    err => this.err = err,
    () => this.isLoading = false);
  }
}
