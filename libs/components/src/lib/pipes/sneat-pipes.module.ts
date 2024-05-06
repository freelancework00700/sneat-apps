import { NgModule, PipeTransform, Type } from '@angular/core';
import { CountryFlagPipe, CountryTitle } from './country-emoji.pipe';
import { Decimal64p2Pipe } from './decimal64p2.pipe';
import {
	GenderColorPipe,
	GenderEmojiPipe,
	GenderIconNamePipe,
} from './gender.pipes';
import { LongMonthNamePipe } from './long-month-name.pipe';
import { ContactTitlePipe } from './member-title.pipe';
import { PersonNamesPipe, PersonTitle } from './person-title.pipe';
import { SelectedMembersPipe } from './selected-members.pipe';
import { ShortMonthNamePipe } from './short-month-name.pipe';
import { TeamEmojiPipe } from './team-emoji.pipe';
import { WdToWeekdayPipe } from './wd-to-weekday.pipe';

const pipes: Type<PipeTransform>[] = [
	TeamEmojiPipe,
	WdToWeekdayPipe,
	LongMonthNamePipe,
	ShortMonthNamePipe,
	ContactTitlePipe,
	PersonTitle,
	PersonNamesPipe,
	GenderIconNamePipe,
	GenderEmojiPipe,
	GenderColorPipe,
	SelectedMembersPipe,
	CountryFlagPipe,
	CountryTitle,
	Decimal64p2Pipe,
];

@NgModule({
	declarations: pipes,
	exports: pipes,
})
export class SneatPipesModule {}
