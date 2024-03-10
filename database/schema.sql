CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS complaints;

CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    latitude TEXT NOT NULL,
    longitude TEXT NOT NULL
);

CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints,
    image_url TEXT NOT NULL
);