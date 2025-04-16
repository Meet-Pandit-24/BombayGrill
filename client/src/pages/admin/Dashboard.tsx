import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HandPlatter, CalendarClock, Utensils, Users } from "lucide-react";
import { RestaurantInfo, MenuCategory, MenuItem, Reservation } from "@shared/schema";

export default function Dashboard() {
  const { data: restaurantInfo, isLoading: loadingRestaurantInfo } = useQuery<RestaurantInfo>({
    queryKey: ["/api/restaurant-info"],
  });

  const { data: menuItems, isLoading: loadingMenuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  const { data: categories, isLoading: loadingCategories } = useQuery<MenuCategory[]>({
    queryKey: ["/api/menu-categories"],
  });

  const { data: reservations, isLoading: loadingReservations } = useQuery<Reservation[]>({
    queryKey: ["/api/reservations"],
  });

  const pendingReservations = reservations?.filter(res => res.status === "pending") || [];
  const confirmedReservations = reservations?.filter(res => res.status === "confirmed") || [];

  // Get today's reservations
  const today = new Date().toISOString().split('T')[0];
  const todayReservations = reservations?.filter(res => res.date === today) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome to the Spice Haven restaurant management system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Menu Items</CardTitle>
            <Utensils className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loadingMenuItems ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{menuItems?.length || 0}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Menu Categories</CardTitle>
            <HandPlatter className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loadingCategories ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{categories?.length || 0}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reservations</CardTitle>
            <CalendarClock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loadingReservations ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{pendingReservations.length}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Reservations</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            {loadingReservations ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{todayReservations.length}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingReservations ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : reservations && reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.slice(0, 5).map((reservation) => (
                  <div key={reservation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium">{reservation.name}</p>
                      <p className="text-sm text-gray-500">{reservation.date} at {reservation.time}</p>
                    </div>
                    <div>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs 
                          ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'}`}
                      >
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">No reservations yet</p>
            )}
          </CardContent>
        </Card>

        {/* Featured Menu Items */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Featured Menu Items</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingMenuItems ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : menuItems && menuItems.filter(item => item.featured).length > 0 ? (
              <div className="space-y-4">
                {menuItems.filter(item => item.featured).slice(0, 5).map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      {item.image && (
                        <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.price}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">
                        {categories?.find(cat => cat.id === item.categoryId)?.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">No featured menu items</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
