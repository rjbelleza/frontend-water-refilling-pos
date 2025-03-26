import { useState, useEffect } from 'react';
import { Grid } from 'gridjs-react';
import 'gridjs/dist/theme/mermaid.css';

const RecentTransTable = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/recentTrans.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        // Parse and prepare the data
        const jsonData = await response.json();
        
        // Convert to plain JS objects if needed
        const preparedData = jsonData.map(item => ({
          ...item,  // Creates new extensible object
          // Add any necessary transformations here
        }));
        
        setTableData(preparedData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample data
        setTableData([{
          customer: "Sample Customer",
          totalAmount: 1000.00,
          dateTime: new Date().toISOString()
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleView = (rowData) => {
    console.log('Viewing:', rowData);
    // Implement your view logic here
    alert(`Viewing: ${rowData.customer}\nAmount: ₱${rowData.totalAmount.toFixed(2)}`);
  };

  if (loading) return <div className="p-4 text-center">Loading transactions...</div>;

  return (
    <div className="p-4">
      <h2 className='font-bold text-[17px] text-blue-600 p-1 mb-2'>Recent Transactions (Today)</h2>
      <Grid
        data={tableData.map((item, index) => [
          index + 1,
          item.customer,
          `₱${item.totalAmount.toFixed(2)}`,
          new Date(item.dateTime).toLocaleString(),
          <button 
            onClick={() => handleView(item)}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm"
          >
            View Details
          </button>
        ])}
        columns={[
          { name: '#', width: '60px', sort: false },
          { name: 'Customer', sort: true, width: '25%' },
          { name: 'Amount', sort: true, width: '20%' },
          { name: 'Time', sort: true, width: '25%' },
          { 
            name: 'Action', 
            sort: false, 
            width: '30%',
            attributes: {
              'class': 'text-center'
            }
          }
        ]}
        pagination={{
          enabled: true,
          limit: 5,
          summary: true
        }}
        style={{
          th: {
            backgroundColor: '#f8fafc',
            padding: '12px 16px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase'
          },
          td: {
            padding: '12px 16px',
            fontSize: '0.875rem',
            verticalAlign: 'middle'
          }
        }}
      />
    </div>
  );
};

export default RecentTransTable;