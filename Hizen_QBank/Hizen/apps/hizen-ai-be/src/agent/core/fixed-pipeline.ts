export interface FixedPipeline<I, O> {
  execute(input: I): Promise<O>;
}
