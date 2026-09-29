import { RoleLabelPipe } from './role-label.pipe';

describe('RoleLabelPipe', () => {
  let pipe: RoleLabelPipe;

  beforeEach(() => {
    pipe = new RoleLabelPipe();
  });

  it('should transform Admin to Administrador', () => {
    expect(pipe.transform('Admin')).toBe('Administrador');
  });

  it('should transform Client to Cliente', () => {
    expect(pipe.transform('Client')).toBe('Cliente');
  });

  it('should transform Helper to Asistente', () => {
    expect(pipe.transform('Helper')).toBe('Asistente');
  });

  it('should return the original value for unknown roles', () => {
    expect(pipe.transform('Unknown')).toBe('Unknown');
  });
});
