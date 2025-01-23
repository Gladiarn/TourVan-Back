import Van from '../models/Van.js';

const cleanupReservations = async () => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0,0,0,0);

        const vans = await Van.find({})

        for (const van of vans){
            const validReservations = van.reservations.filter(
                (reservation) => new Date(reservation.date) >= currentDate
            );

            if(validReservations.length !== van.reservations.length){
                van.reservations = validReservations;
                await van.save()
                console.log(`Removed expired reservations for van: ${van.name}`)
            }
        }
        console.log("Reservation cleanup completed.");

    } catch (error) {
        console.error("Error cleaning up reservations: ", error);
    }
}

export default cleanupReservations;