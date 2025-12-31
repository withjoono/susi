export namespace GetHealth {
  export interface Response {
    /**
     * The status of the health check.
     */
    status: "ok" | "db-not-reachable";
    /**
     * The time it took to execute a raw SQL query on the database.
     *
     * If the database is not reachable, this value is not included.
     *
     * @unit ms
     */
    databaseRoundTripDelay?: number;
  }
}
