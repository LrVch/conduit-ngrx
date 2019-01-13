import { TestBed } from '@angular/core/testing';
import { TitleService } from './title.service';
import { Mock, provideMagicalMock } from 'angular-testing-library';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot } from '@angular/router';
import { environment as env } from '@env/environment';
import { of } from 'rxjs';

describe('TitleService', () => {
  let service: TitleService;
  let translateService: Mock<TranslateService>;
  let title: Mock<Title>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TitleService,
        provideMagicalMock(TranslateService),
        provideMagicalMock(Title)
      ]
    });

    service = TestBed.get(TitleService);
    translateService = TestBed.get(TranslateService);
    title = TestBed.get(Title);
  });

  it('should create an instance successfully', () => {
    expect(service).toBeDefined();
  });

  it('should set title as app name if there is no title in route data', () => {
    const mockSnapshot = {
      children: [
        {
          children: [],
          data: {
            title: null
          }
        }
      ]
    };

    service.setTitle(mockSnapshot as any);
    expect(title.setTitle).toHaveBeenCalledWith(env.appName);
  });

  it('should set title as page name if there is a route data', () => {
    const mockSnapshot = {
      children: [
        {
          children: [],
          data: {
            title: 'title'
          }
        }
      ]
    };
    const translatedTitle = 'Page title';

    translateService.get.and.returnValue(of(translatedTitle));

    service.setTitle(mockSnapshot as any);

    expect(translateService.get).toHaveBeenCalledWith('title');
    expect(title.setTitle).toHaveBeenCalledWith(
      `${translatedTitle} - ${env.appName}`
    );
  });
});
