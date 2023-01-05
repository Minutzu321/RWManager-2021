import abc

class Comanda(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def isWeb(self):
        pass

    @abc.abstractmethod
    def getComanda(self):
        pass

    @abc.abstractmethod
    def executa(self, requester, argumente):
        pass