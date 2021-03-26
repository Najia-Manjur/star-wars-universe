import { PaginateResponse } from './../../interfaces/PaginateResponse';
import { CharacterService } from './../../services/character.service';
import { Character } from './../../interfaces/character';
import { Component, OnInit } from '@angular/core';
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
    let pageNo = +this.route.snapshot.paramMap.get('currentPage');
    this.count = 0;
    this.currentPage = pageNo;
    this.getCharacters(pageNo);
  }

  onPageChanged(page): void {
    this.getCharacters(page);
    this.router.navigate(['/characters/' + page]);
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
    () => {
      this.isLoading = false;
      this.currentPage = page;
    });
  }
}
