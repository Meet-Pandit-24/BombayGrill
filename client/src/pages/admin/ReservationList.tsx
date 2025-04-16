import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Reservation } from "@shared/schema";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Check, X, Calendar, Clock, Users, CalendarClock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReservationList() {
  const { toast } = useToast();
  const [viewReservation, setViewReservation] = useState<Reservation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState("all");

  const { data: reservations, isLoading } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations"],
    refetchInterval: 10000, // Poll every 10 seconds for new data
    refetchOnWindowFocus: true, // Refetch when tab gets focus
  });

  const updateReservationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest('PUT', `/api/reservations/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Reservation updated",
        description: "The reservation status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update reservation status.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    updateReservationMutation.mutate({ id, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  // Filter reservations based on search, date, and tab
  const filteredReservations = reservations
    ? reservations
        .filter(res => {
          // Search filter
          const searchLower = searchTerm.toLowerCase();
          return (
            searchTerm === "" ||
            res.name.toLowerCase().includes(searchLower) ||
            res.email.toLowerCase().includes(searchLower) ||
            res.phone.toLowerCase().includes(searchLower)
          );
        })
        .filter(res => {
          // Status filter based on active tab
          if (activeTab === "all") return true;
          return res.status === activeTab;
        })
        .filter(res => {
          // Date filter
          if (!selectedDate) return true;
          return res.date === selectedDate;
        })
    : [];

  // Get today's reservations
  const todayReservations = reservations
    ? reservations.filter(res => res.date === new Date().toISOString().split('T')[0])
    : [];

  // Get upcoming reservations (future dates)
  const upcomingReservations = reservations
    ? reservations.filter(res => {
        const resDate = new Date(res.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return resDate > today;
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Reservation Management</h1>
        <p className="text-gray-500">View and manage all customer reservations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Today's Reservations</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayReservations.length}</div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <CalendarClock className="h-4 w-4 mr-1" />
              <span>
                {todayReservations.filter(r => r.status === "confirmed").length} confirmed
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Pending Reservations</CardTitle>
            <CardDescription>Awaiting confirmation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {reservations?.filter(r => r.status === "pending").length || 0}
            </div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Requires attention</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Upcoming Reservations</CardTitle>
            <CardDescription>Future bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingReservations.length}</div>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Next 7 days</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservation List</CardTitle>
          <CardDescription>
            View and manage all customer reservations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-full md:w-48">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              >
                Today
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedDate('')}
              >
                All Dates
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredReservations.length === 0 ? (
                <div className="text-center py-10">
                  <CalendarClock className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">No reservations found</h3>
                  <p className="mt-2 text-gray-500">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "No reservations match the selected filters."}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Guests</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell>
                            {reservation.date}
                          </TableCell>
                          <TableCell>{reservation.time}</TableCell>
                          <TableCell>{reservation.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {reservation.guests}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewReservation(reservation)}
                              >
                                View
                              </Button>
                              {reservation.status === "pending" && (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={() => handleStatusChange(reservation.id, "confirmed")}
                                    disabled={updateReservationMutation.isPending}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleStatusChange(reservation.id, "cancelled")}
                                    disabled={updateReservationMutation.isPending}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reservation Details Dialog */}
      <Dialog open={viewReservation !== null} onOpenChange={(open) => !open && setViewReservation(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>
              Review the complete reservation information.
            </DialogDescription>
          </DialogHeader>

          {viewReservation && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-lg">{viewReservation.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(viewReservation.createdAt).toLocaleDateString()} at{" "}
                    {new Date(viewReservation.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>{getStatusBadge(viewReservation.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{viewReservation.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{viewReservation.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium">{viewReservation.guests}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Occasion</p>
                  <p className="font-medium">
                    {viewReservation.occasion
                      ? viewReservation.occasion.charAt(0).toUpperCase() +
                        viewReservation.occasion.slice(1)
                      : "None"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Contact Information</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{viewReservation.email}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{viewReservation.phone}</span>
                  </div>
                </div>
              </div>

              {viewReservation.message && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                  <p className="p-3 bg-gray-50 rounded-md">{viewReservation.message}</p>
                </div>
              )}

              {viewReservation.status === "pending" && (
                <div className="flex justify-between pt-4">
                  <Button
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => {
                      handleStatusChange(viewReservation.id, "confirmed");
                      setViewReservation(null);
                    }}
                    disabled={updateReservationMutation.isPending}
                  >
                    {updateReservationMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Confirm
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleStatusChange(viewReservation.id, "cancelled");
                      setViewReservation(null);
                    }}
                    disabled={updateReservationMutation.isPending}
                  >
                    {updateReservationMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewReservation(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
