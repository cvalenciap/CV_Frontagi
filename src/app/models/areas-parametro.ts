import { AreaAuditoria } from './area-auditoria'
import { AreaAlcanceAuditoria } from './areaalcance-auditoria';
import { AreaCargoAuditoria } from './areacargo-auditoria';
import { AreaCargoSig } from './areacargo-sig';
import { AreaAlcance } from './area-alcance';
import { Norma } from './norma';
import { AreaNormaAuditoria } from './areanorma-auditoria';
import { AreaNormaDet } from './areanorma-det';

export class AreaParametros {
    lstAreaAuditoria: AreaAuditoria[];
    lstAreaAlcanceAuditoria: AreaAlcanceAuditoria[];
    lstAreaCargoAuditoria: AreaCargoAuditoria[];
    lstCargoSig: AreaCargoSig[];
    lstAlcances: AreaAlcance[];
    lstNormas: Norma[];
    lstAreaNormaAuditoria: AreaNormaAuditoria[];
    lstAreaNormaDet: AreaNormaDet[];
}