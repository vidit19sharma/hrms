import { useState, useEffect, useCallback } from 'react';
import { getEmployees, addEmployee, deleteEmployee } from '@/services/employees';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Table from '@/components/Table';
import Card from '@/components/Card';
import Alert from '@/components/Alert';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const validateForm = () => {
    const errors = {};
    if (!formData.employee_id.trim()) errors.employee_id = 'Employee ID is required';
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.department.trim()) errors.department = 'Department is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError('');
      await addEmployee(formData);
      setSuccess('Employee added successfully!');
      setFormData({ employee_id: '', full_name: '', email: '', department: '' });
      await fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add employee');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employee) => {
    if (!window.confirm(`Are you sure you want to delete ${employee.full_name}?`)) return;

    try {
      setDeleting(employee.employee_id);
      setError('');
      await deleteEmployee(employee.employee_id);
      setSuccess('Employee deleted successfully!');
      await fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete employee');
    } finally {
      setDeleting(null);
    }
  };

  const columns = [
    { key: 'employee_id', label: 'ID' },
    { key: 'full_name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Dept' },
  ];

  return (
    <div className="space-y-4 fade-in">
      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Mobile-first: Stack vertically, then side-by-side on larger screens */}
      <div className="grid min-w-0 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Add Employee Form */}
        <Card title="Add New Employee" description="Fill in the details to add a new employee.">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Employee ID"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleInputChange}
              placeholder="e.g., EMP001"
              error={formErrors.employee_id}
              disabled={submitting}
            />
            <Input
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="John Doe"
              error={formErrors.full_name}
              disabled={submitting}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              error={formErrors.email}
              disabled={submitting}
            />
            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Engineering"
              error={formErrors.department}
              disabled={submitting}
            />
            <Button type="submit" className="w-full" loading={submitting}>
              {submitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </form>
        </Card>

        {/* Employee List */}
        <div className="min-w-0 lg:col-span-2">
          <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-foreground md:text-lg">Employee Directory</h2>
              <p className="text-xs text-muted-foreground md:text-sm">
                {loading ? 'Loading...' : `${employees.length} employee${employees.length !== 1 ? 's' : ''} registered`}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchEmployees} disabled={loading}>
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </Button>
          </div>
          <Table
            columns={columns}
            data={employees}
            loading={loading}
            onRowAction={handleDelete}
            actionLabel={deleting ? 'Deleting...' : 'Delete'}
            emptyMessage="No employees found. Add your first employee using the form."
          />
        </div>
      </div>
    </div>
  );
};

export default Employees;
