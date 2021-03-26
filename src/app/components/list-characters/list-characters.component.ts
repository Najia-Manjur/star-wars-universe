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
    let pageNo = +this.route.snapshot.paramMap.get('currentPage'); // set the characters page no using route param initially
    this.count = 0; // initially number of characters in the list is zero
    this.currentPage = pageNo; // set current page
    this.getCharacters(pageNo); // get characters using page no
  }

  // change characters page when a pagination item is clicked
  onPageChanged(page): void { 
    this.getCharacters(page);
    this.router.navigate(['/characters/' + page]);
  }

  // use character service to get the characters specified by page
  getCharacters(page: Number): void {
    this.isLoading = true; // used to show spinner when API call is running
    this.err = null; // used to show the error message in the UI

    this.characterService.getCharacters(page)
    .subscribe((response:PaginateResponse) => {
      console.log(response);
      this.count = response.meta.count; // set total number of characters
      this.characters = response.results;
    },
    err => this.err = err,
    () => {
      this.isLoading = false; // hide spinner as API call is done  
      this.currentPage = page; // set page no in the pagination
    });
  }
}
