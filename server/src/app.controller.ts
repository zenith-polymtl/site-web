import {Controller, Get} from '@nestjs/common';
import {NotionService} from './services/notion/notion.service';

interface Member {
  name: string,
  pictureUrl: string,
}

interface Role {
  roleName: string,
  members: Member[],
}

interface Team {
  year: string,
  teamPictureUrl: string,
  directionRoles: Role[],
  teamRoles: Role[],
}
@Controller()
export class AppController {
  constructor(
    private readonly notionService: NotionService,
) {}

  @Get('events')
  async getEvents() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const data = await this.notionService.queryDatabase('20362814d768818aa6d2f6b203445c60', {
      filter: {
        property: 'Date',
        date: {
          on_or_after: oneWeekAgo.toISOString(),
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    return {
      status: 'success',
      data: data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('crash')
  async getCrashData() {
    const data = await this.notionService.queryDatabase('20e62814d768809599e8f8e7fe82ed27');

    return {
      status: 'success',
      data: data,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('Gallery')
  async gallery() {
    const data = await this.notionService.queryDatabase('21462814d76880dc95b4c77749760757', {
      sorts: [
        {
          property: 'Created time',
          direction: 'descending',
        },
      ],
    });
    const imageUrls = data
      .map((page: any) => {
        const file = page.properties?.Image?.files?.[0];
        return file?.file?.url || null;
      })
      .filter((url: string | null): url is string => Boolean(url));
    return { images: imageUrls.slice(0, 19) };
  }

  @Get('teams')
  async teams() {
    const yearsAndRolesResponse = await this.notionService.queryDatabase('21162814d76880fd96abefa916e8f1bd') as any;
    const membersResponse = await this.notionService.queryDatabase('21162814d76880289610f268ddb20585')  as any;

    const teams: Team[] = yearsAndRolesResponse.filter(entry => entry.properties['Années']?.title?.length > 0)
      .map(entry => {
        const year = entry.properties['Années'].title[0].plain_text;
        const teamPictureUrl = entry.properties.Photo?.files?.[0]?.file?.url || '';

        const directionRoles: Role[] = entry.properties['Direction']?.multi_select?.map(role => ({
          roleName: role.name,
          members: []
        })) || [];
        const teamRoles: Role[] = entry.properties['Équipes']?.multi_select?.map(role => ({
          roleName: role.name,
          members: []
        })) || [];

        return {
          year,
          teamPictureUrl,
          directionRoles,
          teamRoles
        };
      });

    membersResponse.forEach(memberEntry => {
      if (!memberEntry.properties['nom']?.title?.[0]?.plain_text ||
          !memberEntry.properties['années']?.select?.name) return;

      const name = memberEntry.properties['nom'].title[0].plain_text;
      const pictureUrl = memberEntry.properties['image']?.files?.[0]?.file?.url || '';
      const year = memberEntry.properties['années'].select.name;
      const role = memberEntry.properties['poste']?.select?.name;
      if (!role) return;

      const member: Member = { name, pictureUrl };
      const team = teams.find(t => t.year === year);
      if (!team) return;
      let targetRole = team.directionRoles.find(r => r.roleName === role);
      if (!targetRole) {
        targetRole = team.teamRoles.find(r => r.roleName === role);
      } if (targetRole) {
        targetRole.members.push(member);
      }
    });

    teams.sort((a, b) => b.year.localeCompare(a.year));
    return {
      status: 'success',
      data: teams,
      timestamp: new Date().toISOString(),
    };
  }
}
