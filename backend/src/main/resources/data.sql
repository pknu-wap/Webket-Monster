INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(1, '뿌공이', 'Water', '귀여운 부경대 마스코트', 1, 2, 3, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/pukyong-1.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(2, '백경이', 'Water', '부경대 대표 마스코트', 3, 3, 5, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/pukyong-2.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;

INSERT INTO monsters (id, name, type, characteristics, base_level, next_evolution_monster_id, evolution_required_level, image_url) VALUES 
(3, '백경이와 뿌공이', 'Water', '완전체 마스코트', 5, NULL, NULL, 'https://webket-monster-monster-assets.s3.ap-southeast-2.amazonaws.com/pukyong-3.png') ON CONFLICT (id) DO UPDATE SET image_url = EXCLUDED.image_url, name = EXCLUDED.name;
