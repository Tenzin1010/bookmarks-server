CREATE TABLE bookmarks_table (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title text NOT NUll,
    url TEXT NOT NULL,
    description TEXT,
    rating NUMERIC NOT NULL
)

