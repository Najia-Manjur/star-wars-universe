import { CharacterService } from './../character.service';
import { Component, OnInit, TRANSLATIONS } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Film } from './../film';
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
    this.id = +this.route.snapshot.paramMap.get('id');
    this.name = this.route.snapshot.paramMap.get('name');
    this.getFilmsOfCharacter();
  }

  getFilmsOfCharacter(): void {
    this.isLoading = true;
    this.err = null;
    this.characterService.getFilmsOfCharacter(this.id)
    .subscribe((films:Film[]) => {
      this.films = films;
      console.log(this.films);
    },
    err => this.err = err,
    () => this.isLoading = false);
  }

  goBack(): void {
    this.location.back();
  }
}
