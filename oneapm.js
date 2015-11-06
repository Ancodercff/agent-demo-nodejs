exports.config = {
  app_name: [ 'Node.js应用 browser' ],
  collect_traces : true,
  slow_sql : {
    enabled : true,
    max_samples : 10
  },
  transaction_tracer : {
    enabled : true,
    transaction_threshold : 'apdex_f',
    top_n : 20,
    record_sql: 'raw',
    explain_threshold : 500
  }
};
