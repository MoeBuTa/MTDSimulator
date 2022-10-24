from mtdnetwork.mtd.completetopologyshuffle import CompleteTopologyShuffle
from mtdnetwork.mtd.ipshuffle import IPShuffle
from mtdnetwork.mtd.hosttopologyshuffle import HostTopologyShuffle
from mtdnetwork.mtd.portshuffle import PortShuffle
from mtdnetwork.mtd.osdiversity import OSDiversity
from mtdnetwork.mtd.servicediversity import ServiceDiversity
from mtdnetwork.mtd.usershuffle import UserShuffle
from mtdnetwork.data.constants import MTD_REGISTER_DELAY, MTD_TRIGGER_INTERVAL
import random


class MTDScheme:

    def __init__(self, scheme: str, network):
        self._mtd_register_delay = None
        self._mtd_trigger_interval = None
        self._mtd_trigger_std = None
        self._mtd_register_scheme = None
        self._mtd_strategies = [CompleteTopologyShuffle, IPShuffle, HostTopologyShuffle,
                                PortShuffle, OSDiversity, ServiceDiversity, UserShuffle]
        self.network = network
        self._init_mtd_scheme(scheme)

    def _init_mtd_scheme(self, scheme):
        self._mtd_register_delay = MTD_REGISTER_DELAY[scheme]
        self._mtd_trigger_interval, self._mtd_trigger_std = MTD_TRIGGER_INTERVAL[scheme]

        if scheme == 'simultaneously':
            self._mtd_register_scheme = self._register_mtd_simultaneously
        elif scheme == 'randomly':
            self._mtd_register_scheme = self._register_mtd_randomly
        elif scheme == 'deterministically':
            self._mtd_register_scheme = self._register_mtd_deterministically
        elif scheme == 'probabilistically':
            self._mtd_register_scheme = self._register_mtd_probabilistically

    def _register_mtd(self, mtd):
        """
        Registers an MTD strategy that will reconfigure the Network
        during the simulation to try and thwart the hacker.
        """
        mtd_strategy = mtd(network=self.network)
        mtd_strategy.set_batch_register_number(self.network.get_mtd_register_number())
        self.network.get_mtd_strategy_queue().append(mtd_strategy)

    def _register_mtd_simultaneously(self):
        self.network.update_mtd_register_number()
        for mtd in self._mtd_strategies:
            self._register_mtd(mtd=mtd)

    def _register_mtd_randomly(self):
        self.network.update_mtd_register_number()
        random.shuffle(self._mtd_strategies)
        for mtd in self._mtd_strategies:
            self._register_mtd(mtd)

    def _register_mtd_deterministically(self):
        pass

    def _register_mtd_probabilistically(self):
        pass

    def call_register_mtd(self):
        self._mtd_register_scheme()

    def get_mtd_register_delay(self):
        return self._mtd_register_delay

    def get_mtd_trigger_interval(self):
        return self._mtd_trigger_interval

    def get_mtd_trigger_std(self):
        return self._mtd_trigger_std