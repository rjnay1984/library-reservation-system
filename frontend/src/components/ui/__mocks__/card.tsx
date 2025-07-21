export const Card = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-card">{children}</div>
);
export const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-card-header">{children}</div>
);
export const CardFooter = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-card-footer">{children}</div>
);
export const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 data-testid="mock-card-title">{children}</h2>
);
export const CardAction = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-card-action">{children}</div>
);
export const CardDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => <p data-testid="mock-card-description">{children}</p>;
export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-card-content">{children}</div>
);
