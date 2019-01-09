import { AnimationsService } from './animations.service';

describe('AnimationsService', () => {
  let service: AnimationsService;

  beforeEach(() => {
    service = new AnimationsService();
  });

  it('should enable route animation type to "NONE" by default', () => {
    expect(AnimationsService.isRouteAnimationsEnabled()).toBe(true);
  });

  it('should disable route animation', () => {
    service.toggleRouteAnimation(false);
    expect(AnimationsService.isRouteAnimationsEnabled()).toBe(false);
  });

  it('should enable route animation', () => {
    service.toggleRouteAnimation(true);
    expect(AnimationsService.isRouteAnimationsEnabled()).toBe(true);
  });

  it('should set route animation change type to "SLIDE"', () => {
    service.updateRouteAnimationChangeType('SLIDE');
    expect(AnimationsService.isRouteAnimationsChangeType('SLIDE')).toBe(true);
  });

  it('should set route animation change type to "FADE"', () => {
    service.updateRouteAnimationChangeType('FADE');
    expect(AnimationsService.isRouteAnimationsChangeType('FADE')).toBe(true);
  });
});
