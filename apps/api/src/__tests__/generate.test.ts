import request from 'supertest';
import app from '../index';
import { GenerationResult } from '@mini-ai-app-builder/shared-types';

describe('POST /api/generate', () => {
  it('should return a hardcoded GenerationResult with 200 status', async () => {
    const response = await request(app)
      .post('/api/generate')
      .expect(200);

    // Verify the response matches the GenerationResult interface
    const result: GenerationResult = response.body;

    expect(result).toHaveProperty('appName');
    expect(typeof result.appName).toBe('string');

    expect(result).toHaveProperty('entities');
    expect(Array.isArray(result.entities)).toBe(true);

    expect(result).toHaveProperty('userRoles');
    expect(Array.isArray(result.userRoles)).toBe(true);

    expect(result).toHaveProperty('features');
    expect(Array.isArray(result.features)).toBe(true);

    // Verify entity structure
    if (result.entities.length > 0) {
      expect(result.entities[0]).toHaveProperty('name');
      expect(result.entities[0]).toHaveProperty('attributes');
      expect(Array.isArray(result.entities[0].attributes)).toBe(true);
    }

    // Verify userRole structure
    if (result.userRoles.length > 0) {
      expect(result.userRoles[0]).toHaveProperty('name');
      expect(result.userRoles[0]).toHaveProperty('description');
    }

    // Verify feature structure
    if (result.features.length > 0) {
      expect(result.features[0]).toHaveProperty('name');
      expect(result.features[0]).toHaveProperty('description');
    }
  });

  it('should return the expected mock data structure', async () => {
    const response = await request(app)
      .post('/api/generate')
      .expect(200);

    const result: GenerationResult = response.body;

    // Verify the hardcoded mock data
    expect(result.appName).toBe('Sample Todo App');
    expect(result.entities).toHaveLength(2);
    expect(result.userRoles).toHaveLength(2);
    expect(result.features).toHaveLength(3);

    // Verify specific entity
    expect(result.entities[0].name).toBe('Task');
    expect(result.entities[0].attributes).toContain('id');
    expect(result.entities[0].attributes).toContain('title');

    // Verify specific user role
    expect(result.userRoles[0].name).toBe('Admin');
    expect(result.userRoles[0].description).toContain('Full access');

    // Verify specific feature
    expect(result.features[0].name).toBe('Task Management');
    expect(result.features[0].description).toContain('Create, edit, delete');
  });
});