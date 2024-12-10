<script setup lang="ts">
import { ref, computed } from "vue";
import EventDetailsModal from "@/ui/components/Modals/EventDetailsModal.vue";

// Define the Event interface
interface Event {
  id: number;
  title: string;
  date: string;
  type: "project" | "ticket" | "other";
  description: string;
}

// Current date state
const currentDate = ref(new Date());

// Dummy data
const events = ref<Event[]>([
  {
    id: 1,
    title: "Project Kickoff",
    date: new Date().toISOString().split("T")[0],
    type: "project",
    description: "Initial meeting to discuss project scope.",
  },
  {
    id: 2,
    title: "Bug Fix",
    date: new Date().toISOString().split("T")[0],
    type: "ticket",
    description: "Resolve critical issue in production.",
  },
  {
    id: 3,
    title: "Team Outing",
    date: new Date(new Date().setDate(new Date().getDate() + 2))
      .toISOString()
      .split("T")[0],
    type: "other",
    description: "Outdoor team bonding event.",
  },
  {
    id: 4,
    title: "Client Meeting",
    date: new Date(new Date().setDate(new Date().getDate() + 5))
      .toISOString()
      .split("T")[0],
    type: "project",
    description: "Discuss project progress with the client.",
  },
  {
    id: 5,
    title: "Code Review",
    date: new Date(new Date().setDate(new Date().getDate() + 7))
      .toISOString()
      .split("T")[0],
    type: "ticket",
    description: "Review and merge new feature code.",
  },
]);

// New event form
const newEvent = ref<Omit<Event, "id">>({
  title: "",
  date: new Date().toISOString().split("T")[0],
  type: "other",
  description: "",
});

// Modal visibility state
const showModal = ref(false);

// Selected event and event details modal visibility
const selectedEvent = ref<Event>();
const showEventDetailsModal = ref(false);

// Days of the week
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Utility to get all days in a month
const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1);
  const days: Date[] = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

// Computed calendar days
const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = daysInMonth[0].getDay();

  const prevMonthDays = getDaysInMonth(year, month - 1)
    .slice(-firstDayIndex)
    .map((day) => ({
      date: day,
      prevMonth: true,
      nextMonth: false,
      isToday: isToday(day),
    }));

  const currentMonthDays = daysInMonth.map((day) => ({
    date: day,
    prevMonth: false,
    nextMonth: false,
    isToday: isToday(day),
  }));

  const nextMonthDays = getDaysInMonth(year, month + 1)
    .slice(0, 42 - currentMonthDays.length - prevMonthDays.length)
    .map((day) => ({
      date: day,
      prevMonth: false,
      nextMonth: true,
      isToday: isToday(day),
    }));

  return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
});

// Check if a date is today
const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Get events for a specific date
const getEventsForDate = (date: Date) => {
  const formattedDate = date.toISOString().split("T")[0];
  return events.value.filter((event) => event.date === formattedDate);
};

// Add new event
const addEvent = () => {
  if (newEvent.value.title && newEvent.value.date && newEvent.value.description) {
    events.value.push({
      id: Date.now(),
      ...newEvent.value,
    });
    newEvent.value = {
      title: "",
      date: new Date().toISOString().split("T")[0],
      type: "other",
      description: "",
    };
    showModal.value = false;
  }
};

// Delete event
const deleteEvent = (id: number) => {
  events.value = events.value.filter((event) => event.id !== id);
};

// Assign color for event type
const eventTypeColor = (type: string) => {
  switch (type) {
    case "project":
      return "bg-blue-500 text-white";
    case "ticket":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// Timeline chart options
const timelineChartOptions = computed(() => ({
  chart: {
    height: 350,
    type: "rangeBar",
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "50%",
      rangeBarGroupRows: true,
    },
  },
  colors: ["#008FFB", "#00E396", "#775DD0"],
  series: [
    {
      data: events.value.map((event) => ({
        x: event.type,
        y: [
          new Date(event.date).getTime(),
          new Date(event.date).getTime() + 86400000, // Add one day in milliseconds
        ],
        fillColor:
          event.type === "project"
            ? "#008FFB"
            : event.type === "ticket"
            ? "#00E396"
            : "#775DD0",
      })),
    },
  ],
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    labels: {
      formatter: (val: string) => val,
    },
  },
  tooltip: {
    custom: function ({ seriesIndex, dataPointIndex, w }: any) {
      const event = events.value[dataPointIndex];
      return `
        <div class="dark:bg-boxdark p-6 rounded max-w-md w-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold">${event.title}</h3>
          </div>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Type:</strong> ${event.type}</p>
          <p><strong>Description:</strong> ${event.description}</p>
        </div>
      `;
    },
  },
}));

// Open event details modal
const openEventDetails = (event: Event) => {
  selectedEvent.value = event;
  showEventDetailsModal.value = true;
};
</script>

<template>
  <div class="network-calendar">
    <!-- Timeline Chart -->
    <div class="dark:bg-boxdark shadow-md rounded-lg overflow-hidden p-10 my-10">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold mb-4">Event Timeline</h3>

        <!-- Add Event Button -->
        <div class="">
          <button
            class="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
            @click="showModal = true"
          >
            <svg
              class="fill-current duration-300 ease-in-out"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <apexchart
        type="rangeBar"
        height="350"
        :options="timelineChartOptions"
        :series="timelineChartOptions.series"
      >
      </apexchart>
    </div>

    <div class="dark:bg-boxdark shadow-md rounded-lg overflow-hidden p-10">
      <!-- Calendar Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">
          {{ currentDate.toLocaleString("default", { month: "long", year: "numeric" }) }}
        </h2>
        <div>
          <button
            @click="
              currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                1
              )
            "
            class="mr-2 bg-gray-300 px-2 py-1 rounded"
          >
            Previous
          </button>
          <button
            @click="
              currentDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1
              )
            "
            class="bg-gray-300 px-2 py-1 rounded"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-2">
        <div v-for="day in days" :key="day" class="text-center font-bold">
          {{ day }}
        </div>
        <template v-for="(day, index) in calendarDays" :key="index">
          <div
            :class="[
              'p-2 border rounded',
              { 'bg-gray-100': day.prevMonth || day.nextMonth },
              { 'bg-blue-100': day.isToday },
            ]"
          >
            <span class="block text-right">{{ day.date.getDate() }}</span>
            <div class="mt-1">
              <div
                v-for="event in getEventsForDate(day.date)"
                :key="event.id"
                :class="[
                  'text-xs p-1 mb-1 rounded cursor-pointer',
                  eventTypeColor(event.type),
                ]"
                @click="openEventDetails(event)"
              >
                <span>{{ event.title }}</span>
                <button @click.stop="deleteEvent(event.id)" class="ml-1 text-red-500">
                  &times;
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- Add Event Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div class="dark:bg-boxdark p-6 rounded max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Add New Event</h3>
          <button @click="showModal = false" class="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <form @submit.prevent="addEvent" class="flex flex-col space-y-2">
          <input
            v-model="newEvent.title"
            placeholder="Event Title"
            required
            class="border p-2 rounded"
          />
          <input
            v-model="newEvent.date"
            type="date"
            required
            class="border p-2 rounded"
          />
          <select v-model="newEvent.type" required class="border p-2 rounded">
            <option value="project">Project</option>
            <option value="ticket">Ticket</option>
            <option value="other">Other</option>
          </select>
          <textarea
            v-model="newEvent.description"
            placeholder="Description"
            required
            class="border p-2 rounded"
          ></textarea>
          <div class="flex justify-between">
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">Add</button>
            <button
              @click="showModal = false"
              type="button"
              class="bg-gray-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <EventDetailsModal
      :event="selectedEvent"
      :show="showEventDetailsModal"
      @close="showEventDetailsModal = false"
    />
  </div>
</template>

<style scoped>
.network-calendar {
  margin: auto;
}
</style>
