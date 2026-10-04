import { describe, expect, it } from 'vitest';
import { practiceFor, practiceEntryPoint } from '../src/lib/service-discovery';

describe('homepage practice destinations', () => {
  it('keeps social media management in marketing', () => {
    expect(practiceFor('social-media-management').id).toBe('marketing');
    expect(practiceFor('management-advisory').id).toBe('strategy');
  });

  it('opens the main consulting service even when marketing sorts first', () => {
    const services = [{ slug: 'social-media-management' }, { slug: 'cafe-consulting' }, { slug: 'restaurant-consulting' }];
    expect(practiceEntryPoint('strategy', services)?.slug).toBe('restaurant-consulting');
    expect(practiceEntryPoint('strategy', [...services].reverse())?.slug).toBe('restaurant-consulting');
  });

  it('uses a published relevant fallback when the main service is unavailable', () => {
    expect(practiceEntryPoint('strategy', [{ slug: 'social-media-management' }, { slug: 'cafe-consulting' }])?.slug).toBe('cafe-consulting');
    expect(practiceEntryPoint('strategy', [{ slug: 'social-media-management' }])).toBeUndefined();
  });

  it('opens channel pricing and expansion rather than incidental services', () => {
    const services = ['digital-product-web', 'delivery-menu-pricing', 'feasibility-study', 'expansion-study'].map(slug => ({ slug }));
    expect(practiceEntryPoint('delivery', services)?.slug).toBe('delivery-menu-pricing');
    expect(practiceEntryPoint('growth', services)?.slug).toBe('expansion-study');
  });
});
