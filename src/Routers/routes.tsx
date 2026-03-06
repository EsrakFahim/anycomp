import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../Layout/Main";
import { AllSpecialists } from "../Pages/Dashboard/AllSpecialists/AllSpecialists";
import CreateSpecialist from "../Pages/Dashboard/CreateSpecialist/CreateSpecialist";
import Publish from "../Layout/Publish";
import Specialists from "../Pages/Public/Specialists/Specialists";

export const router = createBrowserRouter([
      {
            path: '/',
            element: <Main />,
            children: [
                  {
                        index: true,
                        element: <Navigate to="specialists" replace />
                  },
                  {
                        path: 'specialists',
                        element: <AllSpecialists />
                  },
                  {
                        path: 'clients',
                        element: <div>Clients Page</div>
                  },
                  {
                        path: 'service-orders',
                        element: <div>Service Orders Page</div>
                  },
                  {
                        path: 'e-signature',
                        element: <div>eSignature Page</div>
                  },
                  {
                        path: 'messages',
                        element: <div>Messages Page</div>
                  },
                  {
                        path: 'invoices-receipts',
                        element: <div>Invoices & Receipts Page</div>
                  },
                  {
                        path: 'specialists/create',
                        element: <CreateSpecialist />
                  },
                  {
                        path: 'specialists/edit/:id',
                        element: <CreateSpecialist />
                  }
            ]
      },
      {
            path: 'publish',
            element: <Publish />,
            children: [
                  {
                        index: true,
                        element: <Navigate to="specialists" replace />
                  },
                  {
                        path: 'specialists',
                        element: <Specialists />
                  }
            ]
      },
      {
            path: '*',
            element: <div>404 Not Found</div>
      },
]);