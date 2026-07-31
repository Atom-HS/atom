-- 019 — o vocabulário é um só: 'session_log' → 'session-log'
-- Auditoria 20 § 1: quatro vocabulários de tipos em drift. O registry
-- (type-schemas.json), o enum TS e o token-parser sempre disseram hífen;
-- só o banco (007) e as edges nasceram com underscore — e 2 itens de
-- produção carregam o valor. RENAME VALUE corrige o enum E os itens num
-- gesto só. As funções/views que citavam o literal antigo são recriadas
-- aqui: literal de enum inválido explode em runtime, não no deploy.
-- ORDEM DO DEPLOY: esta migration ANTES das edges v novas (tronco/triage);
-- a edge velha escrevendo 'session_log' falha depois desta migration.

ALTER TYPE atom_type RENAME VALUE 'session_log' TO 'session-log';

-- Recria check_orphan_downgrade (007 Part 5b) com o literal novo.
CREATE OR REPLACE FUNCTION check_orphan_downgrade()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_remaining INT;
  v_type atom_type;
  v_floor INT;
BEGIN
  SELECT COUNT(*) INTO v_remaining
  FROM item_connections
  WHERE source_id = OLD.source_id OR target_id = OLD.source_id;

  IF v_remaining = 0 THEN
    SELECT type INTO v_type FROM items WHERE id = OLD.source_id;

    v_floor := CASE v_type
      WHEN 'project' THEN 5 WHEN 'spec' THEN 5
      WHEN 'task' THEN 3 WHEN 'habit' THEN 3
      WHEN 'recipe' THEN 3 WHEN 'workout' THEN 3
      WHEN 'checkpoint' THEN 3
      WHEN 'session-log' THEN 7 WHEN 'wrap' THEN 7
      ELSE 2
    END;

    -- Only downgrade if floor allows stage 4.
    -- Items with floor 5+ stay at 'connected' and appear in audit.
    IF v_floor <= 4 THEN
      UPDATE items
      SET state = 'validated', updated_at = NOW()
      WHERE id = OLD.source_id AND state = 'connected';
    END IF;
  END IF;

  RETURN OLD;
END;
$$;

-- Recria v_below_floor (007 Part 7) com o literal novo.
CREATE OR REPLACE VIEW v_below_floor AS
SELECT i.id, i.title, i.type, i.genesis_stage,
  CASE i.type
    WHEN 'project' THEN 5 WHEN 'spec' THEN 5
    WHEN 'task' THEN 3 WHEN 'habit' THEN 3
    WHEN 'recipe' THEN 3 WHEN 'workout' THEN 3
    WHEN 'checkpoint' THEN 3
    WHEN 'session-log' THEN 7 WHEN 'wrap' THEN 7
    ELSE 2
  END AS required_floor
FROM items i
WHERE i.state != 'archived'
AND i.genesis_stage < CASE i.type
    WHEN 'project' THEN 5 WHEN 'spec' THEN 5
    WHEN 'task' THEN 3 WHEN 'habit' THEN 3
    WHEN 'recipe' THEN 3 WHEN 'workout' THEN 3
    WHEN 'checkpoint' THEN 3
    WHEN 'session-log' THEN 7 WHEN 'wrap' THEN 7
    ELSE 2
  END;
