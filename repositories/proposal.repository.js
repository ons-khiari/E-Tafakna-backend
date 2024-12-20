const logger = require("../logger/Logger");
const prisma = require("../prisma/prismaClient");

class ProposalRepository {
  async sendProposalToJob(data, userId, jobId) {
    try {
      logger.info("Repository: sendProposalToJob");
      logger.info("Data received:", data); // Log data received

      const userProfile = await prisma.profile.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!userProfile) {
        throw new Error("User profile not found");
      }

      const proposal = await prisma.proposal.create({
        data: {
          coverLetter: data.coverLetter,
          budgetmin: data.budgetmin,
          budgetmax: data.budgetmax,
          date: data.date,
          email: data.email,
          location: data.location,
          cvFile: data.cvFile,
          profileTitle: data.profileTitle,
          phone: data.phone,
          linkedin: data.linkedin,
          github: data.github,
          jobId: parseInt(jobId),
          profileId: userProfile.id,
        },
      });

      return proposal;
    } catch (error) {
      logger.error("Error sending proposal \n" + error.message);
      throw error;
    }
  }

  async getProposals(userId) {
    try {
      logger.info("Repository: getProposals");
      const userProfile = await prisma.profile.findUnique({
        where: {
          userId: userId,
        },
      });
      if (!userProfile) {
        throw new Error("User profile not found");
      }
      const proposals = await prisma.proposal.findMany({
        where: {
          profileId: userProfile.id,
        },
      });
      return proposals;
    } catch (error) {
      logger.error("Error getting proposals \n" + error.message);
      throw error;
    }
  }

  async getProposal(proposalId, userId) {
    try {
      logger.info("Repository: getProposal");
      const userProfile = await prisma.profile.findUnique({
        where: {
          userId: userId,
        },
      });
      if (!userProfile) {
        throw new Error("User profile not found");
      }
      const proposal = await prisma.proposal.findUnique({
        where: {
          id: parseInt(proposalId),
          profileId: userProfile.id,
        },
      });
      if (!proposal) {
        throw new Error("Proposal not found");
      }
      return proposal;
    } catch (error) {
      logger.error("Error getting proposal \n" + error.message);
      throw error;
    }
  }

  async acceptProposal(proposalId, userId) {
    try {
      logger.info("Repository: acceptProposal");
      const userProfile = await prisma.profile.findUnique({
        where: {
          userId: userId,
        },
      });
      if (!userProfile) {
        throw new Error("User profile not found");
      }
      const proposal = await prisma.proposal.update({
        where: {
          id: parseInt(proposalId),
          profileId: userProfile.id,
        },
        data: {
          proposalStatus: "ACCEPTED",
        },
      });
      return proposal;
    } catch (error) {
      logger.error("Error accepting proposal \n" + error.message);
      throw error;
    }
  }

  async declineProposal(proposalId, userId) {
    try {
      logger.info("Repository: declineProposal");
      const userProfile = await prisma.profile.findUnique({
        where: {
          userId: userId,
        },
      });
      if (!userProfile) {
        throw new Error("User profile not found");
      }
      const proposal = await prisma.proposal.update({
        where: {
          id: parseInt(proposalId),
          profileId: userProfile.id,
        },
        data: {
          proposalStatus: "DECLINED",
        },
      });
      return proposal;
    } catch (error) {
      logger.error("Error declining proposal \n" + error.message);
      throw error;
    }
  }
}

module.exports = new ProposalRepository();
