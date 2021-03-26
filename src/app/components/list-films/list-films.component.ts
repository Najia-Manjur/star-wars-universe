import { CharacterService } from './../../services/character.service';
import { Component, OnInit, TRANSLATIONS } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Film } from './../../interfaces/film';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-films',
  templateUrl: './list-films.component.html',
  styleUrls: ['./list-films.component.css']
})
export class ListFilmsComponent implements OnInit {

  films: Film[];
  name: string;
  id: Number;
  isLoading: Boolean;
  err: any;

  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // get character id and name from route
    this.id = +this.route.snapshot.paramMap.get('id');
    this.name = this.route.snapshot.paramMap.get('name');

    // get all the films where the character appeared
    this.getFilmsOfCharacter();
  }

  getFilmsOfCharacter(): void {
    this.isLoading = true; // used to show spinner when API call is running
    this.err = null; // used to show the error message in the UI

    // use service method to get the films using character id
    this.characterService.getFilmsOfCharacter(this.id)
    .subscribe((films:Film[]) => {
      this.films = films;
      console.log(this.films);
    },
    err => this.err = err,
    () => this.isLoading = false); // spinner status will change as the observable completed execution
  }

  goBack(): void {
    // return to list of characters page. 
    this.location.back();
  }
}
