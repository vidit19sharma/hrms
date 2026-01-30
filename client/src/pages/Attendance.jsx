import { useState, useEffect, useCallback } from 'react';
import { getEmployees } from '@/services/employees';
import { markAttendance, getAttendance } from '@/services/attendance';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Table from '@/components/Table';
import Card from '@/components/Card';
import Alert from '@/components/Alert';
import Badge from '@/components/Badge';

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchEmployees = useCallback(async () => {
    try {
      setLoadingEmployees(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch employees');
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  const fetchAttendance = useCallback(async (employeeId) => {
    if (!employeeId) {
      setAttendance([]);
      return;
    }
    try {
      setLoadingAttendance(true);
      const data = await getAttendance(employeeId);
      setAttendance(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setAttendance([]);
      } else {
        setError(err.response?.data?.detail || 'Failed to fetch attendance');
      }
    } finally {
      setLoadingAttendance(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendance(selectedEmployee);
    }
  }, [selectedEmployee, fetchAttendance]);

  const validateForm = () => {
    const errors = {};
    if (!formData.employee_id) errors.employee_id = 'Please select an employee';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.status) errors.status = 'Please select attendance status';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError('');
      await markAttendance(formData);
      setSuccess('Attendance marked successfully!');
      setFormData(prev => ({ ...prev, status: '' }));
      if (selectedEmployee === formData.employee_id) {
        await fetchAttendance(selectedEmployee);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const employeeOptions = employees.map(emp => ({
    value: emp.employee_id,
    label: `${emp.full_name} (${emp.employee_id})`,
  }));

  const statusOptions = [
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
  ];

  const columns = [
    { key: 'date', label: 'Date' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'Present' ? 'success' : 'destructive'}>
          {value}
        </Badge>
      ),
    },
  ];

  const selectedEmployeeData = employees.find(e => e.employee_id === selectedEmployee);

  return (
    <div className="space-y-4 fade-in">
      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Mobile-first: Stack vertically */}
      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Mark Attendance Form */}
        <Card title="Mark Attendance" description="Record attendance for an employee.">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Select
              label="Employee"
              value={formData.employee_id}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, employee_id: e.target.value }));
                if (formErrors.employee_id) setFormErrors(prev => ({ ...prev, employee_id: '' }));
              }}
              options={employeeOptions}
              placeholder={loadingEmployees ? 'Loading...' : 'Select employee'}
              error={formErrors.employee_id}
              disabled={submitting || loadingEmployees}
            />
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, date: e.target.value }));
                if (formErrors.date) setFormErrors(prev => ({ ...prev, date: '' }));
              }}
              error={formErrors.date}
              disabled={submitting}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, status: e.target.value }));
                if (formErrors.status) setFormErrors(prev => ({ ...prev, status: '' }));
              }}
              options={statusOptions}
              placeholder="Select status"
              error={formErrors.status}
              disabled={submitting}
            />
            <Button type="submit" className="w-full" loading={submitting}>
              {submitting ? 'Marking...' : 'Mark Attendance'}
            </Button>
          </form>
        </Card>

        {/* Attendance History */}
        <div className="lg:col-span-2">
          <div className="mb-3">
            <h2 className="text-base font-semibold text-foreground md:text-lg">Attendance History</h2>
            <p className="mb-3 text-xs text-muted-foreground md:text-sm">
              Select an employee to view records
            </p>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              options={employeeOptions}
              placeholder={loadingEmployees ? 'Loading...' : 'Select employee to view history'}
              disabled={loadingEmployees}
            />
          </div>

          {selectedEmployee && selectedEmployeeData && (
            <div className="mb-3 rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {selectedEmployeeData.full_name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground md:text-base">{selectedEmployeeData.full_name}</p>
                  <p className="truncate text-xs text-muted-foreground">{selectedEmployeeData.department}</p>
                </div>
              </div>
            </div>
          )}

          {selectedEmployee ? (
            <Table
              columns={columns}
              data={attendance}
              loading={loadingAttendance}
              emptyMessage={`No attendance records for ${selectedEmployeeData?.full_name || 'this employee'}.`}
            />
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">Select an employee above to view history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
