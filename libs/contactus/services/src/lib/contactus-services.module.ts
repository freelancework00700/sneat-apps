import { NgModule } from '@angular/core';
import { ContactGroupService } from './contact-group-service';
import { ContactNavService } from './contact-nav-service';
import { ContactRoleService } from './contact-role.service';
import { ContactService } from './contact-service';
import { ContactusTeamService } from './contactus-team.service';
import { MemberService } from './member.service';

@NgModule({
	imports: [],
	providers: [
		ContactService,
		ContactNavService,
		ContactGroupService,
		ContactRoleService,
		ContactusTeamService,
		MemberService,
	],
})
export class ContactusServicesModule {}
