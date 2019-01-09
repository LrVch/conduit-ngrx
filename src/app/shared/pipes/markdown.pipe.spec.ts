import { TestBed } from '@angular/core/testing';
import { MarkdownPipe } from './markdown.pipe';

describe('MarkdownPipe', () => {
  const pipe = new MarkdownPipe();

  it('should tramsform markdown to dom', () => {
    expect(pipe.transform('## header').trim()).toBe(
      '<h2 id="header">header</h2>'
    );
    expect(pipe.transform('# header').trim()).toBe(
      '<h1 id="header">header</h1>'
    );
    expect(pipe.transform('### header').trim()).toBe(
      '<h3 id="header">header</h3>'
    );
  });
});
