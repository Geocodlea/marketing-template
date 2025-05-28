const PerformanceTable = ({ data }) => {
  const totals = data.reduce(
    (acc, curr) => {
      acc.impressions += curr.impressions;
      acc.reach += curr.reach;
      acc.spend += curr.spend;
      acc.costPerResult += curr.costPerResult;
      acc.ctr += curr.ctr;
      return acc;
    },
    { impressions: 0, reach: 0, spend: 0, costPerResult: 0, ctr: 0 }
  );

  const numEntries = data.length;
  const averageCostPerResult = totals.costPerResult / numEntries;
  const averageCTR = totals.ctr / numEntries;

  return (
    <table className="table-responsive">
      <thead>
        <tr>
          <th>Impressions</th>
          <th>Reach</th>
          <th>Spend</th>
          <th>Avg. Cost Per Result</th>
          <th>Avg. CTR (%)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{totals.impressions}</td>
          <td>{totals.reach}</td>
          <td>${totals.spend.toFixed(2)}</td>
          <td>${averageCostPerResult.toFixed(2)}</td>
          <td>{averageCTR.toFixed(2)}%</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PerformanceTable;
