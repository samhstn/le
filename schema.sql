BEGIN;

DROP TABLE IF EXISTS user_table CASCADE;
DROP TABLE IF EXISTS collection_table CASCADE;
DROP TABLE IF EXISTS word_table CASCADE;

DROP SEQUENCE IF EXISTS user_seq CASCADE;
DROP SEQUENCE IF EXISTS collection_seq CASCADE;
DROP SEQUENCE IF EXISTS word_seq CASCADE;

/****** 1. USER TABLE ******/
CREATE SEQUENCE user_seq start 100 increment 1 cache 1;
CREATE TABLE user_table (
  user_id BIGINT DEFAULT nextval('user_seq'::text),
  username VARCHAR,
  password VARCHAR,
  decrease_per_hour DECIMAL,
  decrease_per_day DECIMAL,
  correct_answer_increase DECIMAL,
  incorrect_answer_decrease DECIMAL,
  CONSTRAINT user_pk PRIMARY KEY(user_id)
)
WITHOUT OIDS;

/****** 2. COLLECTION TABLE ******/
CREATE SEQUENCE collection_seq start 100 increment 1 cache 1;
CREATE TABLE collection_table (
  collection_id BIGINT DEFAULT nextval('collection_seq'::text),
  user_id BIGINT NOT NULL,
  collection_name VARCHAR,
  collection_description VARCHAR,
  CONSTRAINT collection_pk PRIMARY KEY(collection_id)
)
WITHOUT OIDS;

/****** 3. WORD TABLE ******/
CREATE SEQUENCE word_seq start 100 increment 1 cache 1;
CREATE TABLE word_table (
  word_id BIGINT DEFAULT nextval('word_seq'::text),
  collection_id BIGINT NOT NULL,
  direction VARCHAR,
  source_word VARCHAR,
  target_words VARCHAR[],
  hint VARCHAR,
  attempts VARCHAR,
  correct_attempts VARCHAR,
  CONSTRAINT word_pk PRIMARY KEY(word_id)
)
WITHOUT OIDS;

/****** TABLE FOREIGN KEYS: ******/
ALTER TABLE collection_table ADD CONSTRAINT collection_to_user_fk
  FOREIGN KEY (user_id)
  REFERENCES user_table (user_id)
  ON DELETE CASCADE;

ALTER TABLE word_table ADD CONSTRAINT word_to_collection_fk
  FOREIGN KEY (collection_id)
  REFERENCES collection_table (collection_id)
  ON DELETE CASCADE;

COMMIT;
