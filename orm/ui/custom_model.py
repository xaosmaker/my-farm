from .models import (
    Farms,
    Fields,
    Jobs,
    JobsObservations,
    JobsSupplies,
    Supplies,
    SuppliesDetails,
    SuppliesPrices,
    Users,
)


# Users
def users__str__(self):
    return f"{self.email} {self.farm.name}"


Users.__str__ = users__str__


# Farms
def farms__str__(self):
    return f"{self.name}"


Farms.__str__ = farms__str__


# Fields
def fields__str__(self):
    return f"{self.name} {self.farm.name}"


Fields.__str__ = fields__str__


# Supplies
def supplies__str__(self):
    return f"{self.name} {self.farm.name}"


Supplies.__str__ = supplies__str__


# SuppliesPrices
def suppliesPrices__str__(self):
    return f"{self.price} {self.supply.name}"


SuppliesPrices.__str__ = suppliesPrices__str__


# SuppliesDetails
def suppliesDetails__str__(self):
    return f"{self.description} {self.supply.name}"


SuppliesDetails.__str__ = suppliesDetails__str__


# Jobs
def jobs__str__(self):
    return f"{self.job_type} {self.field.name}"


Jobs.__str__ = jobs__str__


# JobsSupplies
def jobs_supplies__str__(self):
    return f"{self.quantity} {self.job.name}"


JobsSupplies.__str__ = jobs_supplies__str__


# JobsObservations
def jobs_observations__str__(self):
    return f"{self.observations} {self.job.name}"


JobsObservations.__str__ = jobs_observations__str__
